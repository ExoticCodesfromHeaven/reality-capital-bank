import { prisma } from "../../lib/prisma";

export const transferService = {
    async localTransfer(
        userId: string,
        recipientAccountNumber: string,
        amount: number,
        narration?: string
        ) {
            const sender = await prisma.account.findFirst({
            where: {
                userId,
            },
        });

        const receiver =
        await prisma.account.findUnique({
            where: {
            accountNumber:
                recipientAccountNumber,
            },
        });

        if (!sender) {
        throw new Error(
            "Sender account not found."
        );
        }

        if (!receiver) {
        throw new Error(
            "Recipient account not found."
        );
        }

        if (sender.id === receiver.id) {
        throw new Error(
            "You cannot transfer to your own account."
        );
        }

        if (
        Number(sender.balance) < amount
        ) {
        throw new Error(
            "Insufficient balance."
        );
        }
    }
};