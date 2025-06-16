import { Stack, AppBar, Toolbar, Typography, Container, Link } from '@mui/material';

import Form from "./components/Form";

import './App.css';


export default function App(){	
	return(
		<Stack style={{ minHeight: "100vh", background: "#ECF1F5" }}>
			<AppBar position="fixed" sx={{ background: "#FFFFFF", color: "black", boxShadow: "none" }}>
				<Toolbar>
					<Container>
						<Typography variant="h2" style={{ color: "grey" }}>
							<Link
								href="https://github.com/jordanmklee"
								target="_blank" 
        						rel="noopener noreferrer"
								sx={{
									textDecoration: "none",
									color: "grey"
								}}>
								jordanmklee
							</Link>
							/
							<span style={{ color: "black" }}>
								invoice-generator
							</span>
						</Typography>
					</Container>
				</Toolbar>
			</AppBar>

			<Container style={{ paddingTop: "64px", paddingBottom: "64px", height: "100%" }}>
				<Form/>
			</Container>
		</Stack>
	)
}
