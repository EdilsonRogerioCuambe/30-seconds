export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full flex justify-center items-center h-16 bg-[#202024] text-[#f5f5f5]">
      <p className="text-center text-sm sm:text-base">
        &copy; {new Date().getFullYear()} Todos os direitos reservados.
        Desenvolvido por{' '}
        <a
          href="https://github.com/EdilsonRogerioCuambe"
          className="text-[#f5f5f5] underline"
        >
          Edilson Rogerio Cuambe
        </a>
      </p>
    </footer>
  )
}
