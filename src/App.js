import { useState, useEffect } from "react";

import { Stack, AppBar, Toolbar, Typography, Button, Divider, Container } from '@mui/material';
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
		<Stack direction="col" style={{ background: "lightgrey" }}>
			<AppBar position="fixed" sx={{ background: "white", color: "black", boxShadow: "none" }}>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Typography variant="h6" style={{ color: "grey" }}>jordanmklee / <span style={{ color: "black" }}>invoice-generator</span></Typography>
				</Toolbar>
				<Divider/>
			</AppBar>

			<Container style={{ paddingTop: "64px", paddingBottom: "128px" }}>
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
					sx={{ flex: 2, overflowY: "auto" }}/>
			</Container>
		</Stack>
	)
}
