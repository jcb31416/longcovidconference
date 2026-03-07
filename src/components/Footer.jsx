export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 pt-8 pb-12 text-center text-xs text-zinc-400">
      © {new Date().getFullYear()} Regeneratics. All rights reserved.
    </footer>
  );
}
