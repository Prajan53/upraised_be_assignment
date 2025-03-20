-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Available', 'Deployed', 'Destroyed', 'Decommissioned');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gadget" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Available',
    "decommissionedAt" TIMESTAMP(3),

    CONSTRAINT "Gadget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
