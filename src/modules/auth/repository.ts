import { prisma } from "@/lib/prisma";

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
