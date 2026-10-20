import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-stone-900 mb-1">Terjadi Gangguan Tampilan</h2>
            <p className="text-xs text-stone-500 mb-4">
              Aplikasi mengalami kendala saat memuat komponen:
            </p>
            <div className="p-3 bg-[#FFFCF4] rounded-lg text-left text-xs font-mono text-red-600 border border-stone-200 overflow-x-auto mb-5">
              {this.state.error?.message || 'Unknown error occurred.'}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 bg-[#FF6115] hover:bg-[#EA4E00] active:bg-[#C23E00] text-stone-950 text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
