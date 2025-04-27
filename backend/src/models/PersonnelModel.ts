import prisma from '../config/db';

export const getAll = async () => {
  return await prisma.personnel.findMany();
};

export const getAvailableByRole = async (role: string | any) => {
  return await prisma.personnel.findMany({
    where: {
      role,
      available: true,
    },
  });
};

export const assignPersonnel = async (id: number) => {
  return await prisma.personnel.update({
    where: { id },
    data: { available: false },
  });
};

export const releasePersonnel = async (id: number) => {
  return await prisma.personnel.update({
    where: { id },
    data: { available: true },
  });
};

export const addPersonnel = async (name: string, contact: string, role: string | any) => {
  return await prisma.personnel.create({
    data: {
      name: name,
      contact: contact,
      role: role,
      available: true,
    },
  });
};
