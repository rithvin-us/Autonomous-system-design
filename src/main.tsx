import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/inter';
import './styles/global.css';
import { applyTheme } from './content/theme';
import { Presentation } from './shell/Presentation';
import { PresenterView } from './shell/PresenterView';

applyTheme();

const isPresenter = new URLSearchParams(window.location.search).has('presenter');

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isPresenter ? <PresenterView /> : <Presentation />}</StrictMode>,
);
