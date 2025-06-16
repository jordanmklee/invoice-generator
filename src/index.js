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
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontSize: "1.5rem",
			fontWeight: 400,
			lineHeight: 1.2,
		},
		h2: {
			fontSize: "1rem",
			fontWeight: 400,
		},
		body1: {
			fontSize: "1rem",
			lineHeight: 1.6,
		},
		body2: {
			fontSize: "0.875rem",
			lineHeight: 0.875,
		},
		tableHeading:{
			fontSize: "0.8rem",
			color: "#555555",
		},
		button: {
			fontWeight: 500,
			textTransform: "none",
		},
	},
	components: {
		MuiTextField: {
			defaultProps: { variant: "filled", size: "small" },
		},
		MuiInputLabel: {
			styleOverrides:{
				root: {
					fontSize: "0.8rem",
					'&.MuiInputLabel-shrink': {
						fontSize: '1rem',
						color: "grey"
					},
				},
			}
		},
		MuiFilledInput: {
			styleOverrides: {
				root: {
					backgroundColor: "#FFFFFF",
					border: "1px solid lightgrey",
					borderRadius: "8px",
					'&:before, &:after': {
						borderBottom: 'none',
					},
					'&:hover:not(.Mui-disabled, .Mui-error):before': {
						borderBottom: 'none',
					},
				},
				input: {
					fontSize: "0.9rem",
				}
			}
		},
		MuiTable: {
			styleOverrides: {
				root: {
					backgroundColor: "#EFF4F8",
					borderRadius: "8px",
				}
			}
		},
		MuiTableCell: {
			styleOverrides: {
				head: {
					fontSize: "0.8rem",
					fontWeight: 600,
				},
			},
		},
		MuiIconButton: {
			defaultProps: {
				size: 'small',
			},
			styleOverrides: {
				sizeSmall: {
					padding: 4,
					width: 32,
					height: 32,
					// Also style the Icon child
					'& .MuiSvgIcon-root': {
						fontSize: '1.25rem',
					},
				},
			},
		},
	}
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</React.StrictMode>
);
