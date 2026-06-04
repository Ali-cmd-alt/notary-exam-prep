export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 mb-4">
          <strong>Disclaimer:</strong> This website is an independent study resource and is not
          affiliated with, endorsed by, or connected to the California Secretary of State or any
          government agency. All materials are for educational reference only. Please refer to the
          latest official laws, regulations, and examination requirements issued by the California
          Secretary of State.
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} NotaryPrep CA. All rights reserved.</span>
          <a href="/blog" className="hover:text-blue-600">Blog</a>
          <a href="/pricing" className="hover:text-blue-600">Pricing</a>
          <a href="/terms" className="hover:text-blue-600">Terms</a>
          <a href="/privacy" className="hover:text-blue-600">Privacy</a>
          <a href="/refund" className="hover:text-blue-600">Refund</a>
          <a href="mailto:support@notaryprepca.com" className="hover:text-blue-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}
