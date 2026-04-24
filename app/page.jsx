import CustomButton from "@/components/common/CustomButton";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4">
        <section className="py-20 text-center space-y-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              A Centralised Digital Platform for Comprehensive Student Activity
              Record in HEIs
            </h1>

            <div className="text-lg md:text-xl text-muted-foreground space-y-2 max-w-3xl mx-auto">
              <p>
                This platform helps students build a verified portfolio while
                institutions get ready-to-use reports for NAAC, AICTE, and NIRF
                accreditation.
              </p>
              <p>
                Streamline documentation, enhance transparency, and support
                institutional excellence through comprehensive activity
                tracking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/login">
                <CustomButton size="lg" className="text-lg px-8">
                  Login
                </CustomButton>
              </Link>
              <Link href="/signup">
                <CustomButton
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 bg-transparent"
                >
                  Register your college
                </CustomButton>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 StudentHub Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
