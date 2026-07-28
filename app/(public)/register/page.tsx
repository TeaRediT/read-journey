import Container from "@/components/common/Container/Container";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import Image from "next/image";

const Register = () => {
  return (
    <main className="py-5 md:py-8">
      <Container>
        <div className="flex flex-col gap-2.5 md:gap-4 ds:flex-row">
          <section className="auth-section w-full">
            <div className="bg-surface rounded-[30px] p-5 pb-10 md:py-10 md:px-16 md:pb-53.5 ds:pb-10 h-full">
              <div className="flex gap-1 h-4.25 mb-10 md:mb-39.25 ds:mb-26.75">
                <svg width={42} height={17} fill="#F9F9F9">
                  <use href="/sprite.svg#icon-logo"></use>
                </svg>
                <p className="hidden md:block font-bold text-[18px] leading-none uppercase">
                  read journey
                </p>
              </div>
              <h1 className="font-bold text-[32px] leading-none mb-5 md:text-[64px] md:leading-[0.94] md:w-111 md:mb-10">
                Expand your mind, reading{" "}
                <span className="text-[rgba(227,227,227,0.5)]">a book</span>
              </h1>
              <RegisterForm />
            </div>
          </section>

          <section className="preview-section md:hidden ds:block w-full">
            <div className="bg-surface rounded-[30px] ds:pt-20 ds:px-0 flex items-end justify-center h-full overflow-hidden">
              <Image
                className="ds:hidden"
                width={255}
                height={331}
                src={"/phone-mobile.png"}
                alt="preview"
              />
              <Image
                className="hidden ds:block object-bottom"
                width={405}
                height={656}
                src={"/phone-desktop.png"}
                alt="preview"
                priority
              />
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
};

export default Register;
