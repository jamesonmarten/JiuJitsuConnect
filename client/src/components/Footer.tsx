export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <span className="text-lg">🥋</span>
            <div>
              <h3 className="font-semibold">MMA Connect</h3>
              <p className="text-sm text-muted-foreground">by Dev Cabin Technologies</p>
            </div>
          </div>
          
          <div className="flex gap-6 text-sm">
            <a 
              href="https://devcabin.tech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Visit DCT Website
            </a>
            <a 
              href="https://devcabin.tech/portfolio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Portfolio
            </a>
            <a 
              href="https://devcabin.tech/contact" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
        
        <hr className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Dev Cabin Technologies. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            <a 
              href="https://devcabin.tech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Powered by DCT
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}