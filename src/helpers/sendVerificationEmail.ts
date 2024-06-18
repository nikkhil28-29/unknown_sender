import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    VerifyCode: string,
): Promise<ApiResponse> {  // returns a Promise that will eventually resolve to an ApiResponse object.
                            //ApiResponse:  type (interface or type) that defines the structure of the data that sendVerificationEmail function promises to return once the asynchronous operation complete
    try {
        const a = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'unknown_sender | Verification Mail',
            react: VerificationEmail({ username, otp: VerifyCode }), // assuming VerificationEmail is a valid component
        });
        console.log(a);
        // After sending email successfully
        return { success: true, message: 'Verification Email Sent successfully!' };
    } catch (emailError) {
        console.log("Error sending Verification Email", emailError);
        return { success: false, message: 'Failed to send verification email' };
    }
}