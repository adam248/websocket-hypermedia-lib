{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # Node.js and npm for build tools
    nodejs_20
    nodePackages.npm
    
    # Build tools
    nodePackages.terser
    nodePackages.eslint
    nodePackages.prettier
    
    # Compression tools
    gzip
    
    # Git for version control
    git
    
    # Text processing tools
    jq
    
    # Development tools
    tree
    wget
    curl
    
    # Optional: For testing with different Node versions
    nodejs_22
  ];

  shellHook = ''
    echo "🚀 WebSocket Hypermedia Development Environment"
    echo "=============================================="
    echo ""
    echo "Available commands:"
    echo "  npm install          - Install dependencies"
    echo "  npm run build        - Build minified and gzipped versions"
    echo "  npm run test:local   - Run full test suite"
    echo "  npm run lint         - Run ESLint"
    echo "  npm run format       - Format code with Prettier"
    echo "  bash test.sh         - Quick test run"
    echo ""
    echo "Build pipeline:"
    echo "  npm run clean        - Clean dist/ folder"
    echo "  npm run minify       - Minify source file"
    echo "  npm run gzip         - Create gzipped version"
    echo "  npm run size         - Show file sizes"
    echo ""
    echo "Node.js version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo ""
  '';

  # Environment variables
  NODE_ENV = "development";
  
  # Make sure we're in the right directory
  PWD = builtins.getEnv "PWD";
} 