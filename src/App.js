import { useState, useEffect } from "react";

import { Stack, AppBar, Toolbar, Typography, Button, Divider, Container, Link } from '@mui/material';
import { FileDownload } from "@mui/icons-material";

import dayjs from "dayjs";

import Form from "./components/Form";

import generatePDF from "./PDFGenerator";

import './App.css';


export default function App(){
	const [companyName, setCompanyName] = useState(localStorage.getItem("companyName"));
	const [companyPhone, setCompanyPhone] = useState(localStorage.getItem("companyPhone"));
	const [companyEmail, setCompanyEmail] = useState(localStorage.getItem("companyEmail"));
	const [companyBusinessNumber, setCompanyBusinessNumber] = useState(localStorage.getItem("companyBusinessNumber"));

	const [date, setDate] = useState(dayjs(new Date()));
	const [invoiceNumber, setInvoiceNumber] = useState("");

	const [customerName, setCustomerName] = useState("");
	const [projectAddress, setProjectAddress] = useState("");
	const [notes, setNotes] = useState("");

	const [items, setItems] = useState([{
		description: "",
		qty: 1,
		rate: 0.00,
		amount: 0.00
	}]);
	const [summary, setSummary] = useState({
		subtotal: 0.00,
		tax: 0.00,
		total: 0.00
	});
	
	// Update the summary on invoice item change
	useEffect(() => {
		let subtotal = 0.00;
		items.forEach(item => {
			subtotal += item.amount;
		})

		let tax = subtotal * 0.05;
		let total = subtotal + tax;

		setSummary({
			subtotal: subtotal,
			tax: tax,
			total: total,
		})
	}, [items])

	// TODO define MUI typography styles
	// TODO define colours globally
	// TODO make a helper function to parse dollar amounts (and handle NaN errors when generating)
	return(
		<Stack direction="col" style={{ height: "100vh" }}>
			<AppBar position="fixed" sx={{ background: "white", color: "black", boxShadow: "none" }}>
				<Toolbar>
					<Container>
						<Typography variant="h6" style={{ color: "grey" }}>
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
				<Divider/>
			</AppBar>

			<Container style={{ paddingTop: "64px", height: "100%" }}>
				<Form
					companyName={companyName}
					setCompanyName={value => {
						localStorage.setItem("companyName", value);
						setCompanyName(value);
					}}
					companyEmail={companyEmail}
					setCompanyEmail={ value => {
						localStorage.setItem("companyEmail", value);
						setCompanyEmail(value);
					}}
					companyPhone={companyPhone}
					setCompanyPhone={ value => {
						localStorage.setItem("companyPhone", value);
						setCompanyPhone(value);
					}}
					companyBusinessNumber={companyBusinessNumber}
					setCompanyBusinessNumber={ value => {
						localStorage.setItem("companyBusinessNumber", value);
						setCompanyBusinessNumber(value);
					}}
					date={date} setDate={setDate}
					invoiceNumber={invoiceNumber} setInvoiceNumber={setInvoiceNumber}
					customerName={customerName} setCustomerName={setCustomerName}
					projectAddress={projectAddress} setProjectAddress={setProjectAddress}
					notes={notes} setNotes={setNotes}
					items={items} setItems={setItems}
					summary={summary}
					sx={{ overflowY: "auto" }}/>
			</Container>
		</Stack>
	)
}
