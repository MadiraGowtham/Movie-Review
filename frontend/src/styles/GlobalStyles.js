import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #0a0a0a;
    color: #ffffff;
    line-height: 1.6;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, textarea {
    font-family: inherit;
    outline: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  ::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Selection styles */
  ::selection {
    background: #e50914;
    color: white;
  }

  /* Focus styles */
  *:focus-visible {
    outline: 2px solid #e50914;
    outline-offset: 2px;
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

export const Section = styled.section`
  padding: 60px 0;

  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  outline: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.primary {
    background: linear-gradient(135deg, #e50914, #f40612);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(229, 9, 20, 0.3);
    }
  }

  &.secondary {
    background: transparent;
    color: #e50914;
    border: 2px solid #e50914;
    
    &:hover:not(:disabled) {
      background: #e50914;
      color: white;
    }
  }

  &.outline {
    background: transparent;
    color: #ffffff;
    border: 2px solid #333;
    
    &:hover:not(:disabled) {
      border-color: #e50914;
      color: #e50914;
    }
  }

  &.small {
    padding: 8px 16px;
    font-size: 12px;
  }

  &.large {
    padding: 16px 32px;
    font-size: 16px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #1a1a1a;
  color: #ffffff;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #e50914;
  }

  &::placeholder {
    color: #666;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #1a1a1a;
  color: #ffffff;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #e50914;
  }

  &::placeholder {
    color: #666;
  }
`;

export const Card = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #333;
  transition: all 0.3s ease;

  &:hover {
    border-color: #444;
    transform: translateY(-2px);
  }
`;

export const Grid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '0'};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
`;

export const Heading = styled.h1`
  font-size: ${props => {
    switch (props.size) {
      case 'xl': return '3rem';
      case 'lg': return '2.5rem';
      case 'md': return '2rem';
      case 'sm': return '1.5rem';
      default: return '2rem';
    }
  }};
  font-weight: ${props => props.weight || '700'};
  color: ${props => props.color || '#ffffff'};
  margin-bottom: ${props => props.mb || '0'};
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: ${props => {
      switch (props.size) {
        case 'xl': return '2.5rem';
        case 'lg': return '2rem';
        case 'md': return '1.75rem';
        case 'sm': return '1.25rem';
        default: return '1.75rem';
      }
    }};
  }
`;

export const Text = styled.p`
  font-size: ${props => props.size || '14px'};
  color: ${props => props.color || '#cccccc'};
  line-height: 1.6;
  margin-bottom: ${props => props.mb || '0'};
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid #333;
  border-radius: 50%;
  border-top-color: #e50914;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Default export for backward compatibility
export default LoadingSpinner;

export { GlobalStyles };

export const ErrorMessage = styled.div`
  color: #e50914;
  font-size: 14px;
  margin-top: 8px;
`;

export const SuccessMessage = styled.div`
  color: #4caf50;
  font-size: 14px;
  margin-top: 8px;
`;
