export default function Footer() {
  return (
    <footer className="py-6 text-center text-xs xs:text-sm md:text-base text-text-muted font-body">
      &copy; {new Date().getFullYear()} Sancochoz. All rights reserved.
    </footer>
  );
}
