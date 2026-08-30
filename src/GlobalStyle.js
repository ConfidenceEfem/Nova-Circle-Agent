import { createGlobalStyle } from 'styled-components';
import { colors, font } from './theme';

export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    background: ${colors.void};
    background-image:
      radial-gradient(ellipse 1000px 600px at 10% -10%, rgba(61,23,104,0.35), transparent 60%),
      radial-gradient(ellipse 800px 500px at 100% 0%, rgba(139,92,246,0.10), transparent 55%),
      radial-gradient(ellipse 600px 400px at 50% 100%, rgba(61,23,104,0.18), transparent 60%);
    background-attachment: fixed;
    color: ${colors.paper};
    font-family: ${font.body};
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    margin: 0;
    font-family: ${font.display};
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  p { margin: 0; }

  a { color: inherit; text-decoration: none; }

  button, input, select, textarea {
    font-family: inherit;
    color: inherit;
  }

  button { cursor: pointer; }

  ::selection {
    background: ${colors.novaBright};
    color: ${colors.void};
  }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: ${colors.void}; }
  ::-webkit-scrollbar-thumb {
    background: ${colors.stroke};
    border-radius: 999px;
    border: 2px solid ${colors.void};
  }
  ::-webkit-scrollbar-thumb:hover { background: ${colors.faint}; }

  :focus-visible {
    outline: 2px solid ${colors.novaBright};
    outline-offset: 2px;
  }

  @keyframes pulseRing {
    0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.55); }
    70% { box-shadow: 0 0 0 8px rgba(139,92,246,0); }
    100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); }
  }

  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
  }
`;
