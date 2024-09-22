import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { blue } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			main: blue[500],
			dark: blue[900],
		},
	},
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
		<App />
		</ThemeProvider>
	</React.StrictMode>
);
