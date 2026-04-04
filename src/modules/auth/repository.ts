import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  AuthUserIdentity,
  ResolveGoogleAccountUserIdParams,
} from "@/modules/auth/types";

export async function findUserWithAccountsByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });
}

export async function createCredentialsUser(params: {
  email: string;
  name?: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: {
      email: params.email,
      name: params.name,
      passwordHash: params.passwordHash,
    },
    include: { accounts: true },
  });
}

export async function attachCredentialsToUser(params: {
  userId: string;
  existingName: string | null;
  newName?: string;
  passwordHash: string;
}) {
  return prisma.user.update({
    where: { id: params.userId },
    data: {
      passwordHash: params.passwordHash,
      name: params.existingName ?? params.newName ?? null,
    },
    include: { accounts: true },
  });
}

export async function findUserWithAccountsById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });
}

export async function findUserForCredentialsByEmail(
  email: string,
): Promise<AuthUserIdentity | null> {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
    },
  });
}

type GoogleAccountRecord = {
  id: string;
  userId: string;
};

type GoogleLinkedUserRecord = {
  id: string;
  name: string | null;
  emailVerified: Date | null;
};

type GoogleAccountData = Prisma.AccountUncheckedCreateInput;

async function findGoogleAccountByProviderId(
  tx: Prisma.TransactionClient,
  providerAccountId: string,
): Promise<GoogleAccountRecord | null> {
  return tx.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId,
      },
    },
    select: {
      id: true,
      userId: true,
    },
  });
}

async function findGoogleLinkedUserByEmail(
  tx: Prisma.TransactionClient,
  email: string,
): Promise<GoogleLinkedUserRecord | null> {
  return tx.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      emailVerified: true,
    },
  });
}

async function ensureGoogleLinkedUser(params: {
  tx: Prisma.TransactionClient;
  email: string;
  name: string | null;
  emailVerified: boolean;
}): Promise<GoogleLinkedUserRecord> {
  const existing = await findGoogleLinkedUserByEmail(params.tx, params.email);

  if (!existing) {
    return params.tx.user.create({
      data: {
        email: params.email,
        name: params.name,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        name: true,
        emailVerified: true,
      },
    });
  }

  const shouldUpdateName = !existing.name && params.name;
  const shouldVerifyEmail = !existing.emailVerified && params.emailVerified;
  if (!shouldUpdateName && !shouldVerifyEmail) {
    return existing;
  }

  return params.tx.user.update({
    where: { id: existing.id },
    data: {
      ...(shouldUpdateName ? { name: params.name } : {}),
      ...(shouldVerifyEmail ? { emailVerified: new Date() } : {}),
    },
    select: {
      id: true,
      name: true,
      emailVerified: true,
    },
  });
}

function buildGoogleAccountData(params: {
  userId: string;
  providerAccountId: string;
  accountType: string;
  oauthTokens: ResolveGoogleAccountUserIdParams["oauthTokens"];
}): GoogleAccountData {
  return {
    userId: params.userId,
    type: params.accountType,
    provider: "google",
    providerAccountId: params.providerAccountId,
    refresh_token: params.oauthTokens.refresh_token ?? null,
    access_token: params.oauthTokens.access_token ?? null,
    expires_at: params.oauthTokens.expires_at ?? null,
    token_type: params.oauthTokens.token_type ?? null,
    scope: params.oauthTokens.scope ?? null,
    id_token: params.oauthTokens.id_token ?? null,
    session_state: params.oauthTokens.session_state ?? null,
  };
}

async function upsertGoogleAccount(params: {
  tx: Prisma.TransactionClient;
  existingAccount: GoogleAccountRecord | null;
  accountData: GoogleAccountData;
}): Promise<void> {
  if (params.existingAccount) {
    await params.tx.account.update({
      where: { id: params.existingAccount.id },
      data: params.accountData,
    });
    return;
  }

  await params.tx.account.create({
    data: params.accountData,
  });
}

export async function resolveGoogleAccountUserId(
  params: ResolveGoogleAccountUserIdParams,
): Promise<string | null> {
  if (!params.emailVerified) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    const normalizedEmail = params.email.toLowerCase();
    const existingGoogleAccount = await findGoogleAccountByProviderId(
      tx,
      params.providerAccountId,
    );
    const user = await ensureGoogleLinkedUser({
      tx,
      email: normalizedEmail,
      name: params.name,
      emailVerified: params.emailVerified,
    });

    if (existingGoogleAccount && existingGoogleAccount.userId !== user.id) {
      return null;
    }

    await upsertGoogleAccount({
      tx,
      existingAccount: existingGoogleAccount,
      accountData: buildGoogleAccountData({
        userId: user.id,
        providerAccountId: params.providerAccountId,
        accountType: params.accountType,
        oauthTokens: params.oauthTokens,
      }),
    });

    return user.id;
  });
}
