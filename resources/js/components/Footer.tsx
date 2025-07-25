export default function Footer() {
  return (
    <footer
      className="mt-auto py-1 text-center text-sm
                 bg-gray-100 text-gray-700
                 dark:bg-gray-800 dark:text-gray-300"
      style={{ flexShrink: 0 }}
    >
      <div>Created By : Mina Hawarei © {new Date().getFullYear()} - TechLead Team</div>
    </footer>
  );
}
