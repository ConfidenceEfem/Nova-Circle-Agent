import { Component } from 'react';
import styled from 'styled-components';
import { AlertTriangle } from 'lucide-react';
import { colors, font, radius } from '../theme';

const Wrap = styled.div`
  max-width: 640px;
  margin: 80px auto;
  padding: 30px;
  background: ${colors.panel};
  border: 1px solid rgba(255, 92, 92, 0.35);
  border-radius: ${radius.lg};
  text-align: center;
`;

const Message = styled.pre`
  margin-top: 16px;
  padding: 14px;
  background: ${colors.panelRaised};
  border-radius: ${radius.md};
  color: ${colors.down};
  font-family: ${font.mono};
  font-size: 12px;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
`;

// Without this, ANY uncaught error in ANY page — a bad import, a hook
// called in the wrong place, a null reference — unmounts the entire React
// tree and leaves a totally blank white screen with the real reason only
// visible in the browser console. This catches that and shows the actual
// error instead, which is the difference between "the app is broken" and
// "line 47 of SignalDetail.jsx references an undefined variable."
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <Wrap>
          <AlertTriangle size={28} color={colors.down} />
          <h2 style={{ marginTop: 12, color: colors.paper, fontFamily: font.body, fontSize: 18 }}>
            Something broke on this page
          </h2>
          <Message>{this.state.error.message}</Message>
        </Wrap>
      );
    }
    return this.props.children;
  }
}
