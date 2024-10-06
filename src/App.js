import { useState, useEffect } from "react";

import { Stack, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { FileDownload } from "@mui/icons-material";

import dayjs from "dayjs";

import { usePDF } from 'react-to-pdf';

import Form from "./components/Form";
import InvoicePreview from "./components/InvoicePreview";

import './App.css';


export default function App(){
	const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});

	const [companyName, setCompanyName] = useState(localStorage.getItem("companyName"));
	const [billTo, setBillTo] = useState("");
	const [date, setDate] = useState(dayjs(new Date()));
	const [invoiceNumber, setInvoiceNumber] = useState("");
	const [projectAddress, setProjectAddress] = useState("");
	const [poNumber, setPoNumber] = useState("");

	const [items, setItems] = useState([]);
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
	// TODO make a helper function to parse dollar amounts (and handle NaN errors)
	return(
		<Stack direction="col" style={{ height: "100vh" }}>
			<AppBar position="fixed" sx={{ background: "white", color: "black", boxShadow: "none" }}>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Typography variant="h5">Invoice Generator</Typography>
					<Button
						variant="contained"
						startIcon={<FileDownload/>}
						onClick={() => toPDF()}>
						Download PDF
					</Button>
				</Toolbar>
			</AppBar>

			<Stack direction="row" style={{ width: "100%", background: "grey", paddingTop: "64px" }}>
				<Form
					companyName={companyName} setCompanyName={setCompanyName}
					billTo={billTo} setBillTo={setBillTo}
					date={date} setDate={setDate}
					invoiceNumber={invoiceNumber} setInvoiceNumber={setInvoiceNumber}
					projectAddress={projectAddress} setProjectAddress={setProjectAddress}
					poNumber={poNumber} setPoNumber={setPoNumber}
					items={items} setItems={setItems}
					summary={summary}
					sx={{ flex: 1, overflowY: "auto" }}/>

				<InvoicePreview
					pdfRef={targetRef}
					companyName={companyName}
					billTo={billTo}
					date={date}
					invoiceNumber={invoiceNumber}
					projectAddress={projectAddress}
					poNumber={poNumber}
					items={items}
					summary={summary}
					sx={{ flex: 2, overflowY: "auto" }}/>
			</Stack>
		</Stack>
	)
}
