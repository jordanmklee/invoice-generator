import { useState, useEffect } from "react";

import { Box, Button, Stack, Container, Modal } from '@mui/material';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Typography from '@mui/material/Typography';

import { PDFViewer } from '@react-pdf/renderer';

import { Add as AddIcon } from '@mui/icons-material';

import Header from "./Form/Header";
import Summary from "./Form/Summary";
import InvoiceItem from "./Form/InvoiceItem";

import './App.css';
import dayjs from "dayjs";
import GeneratedDocument from "./GeneratedDocument";


export default function App(){
	const [rendered, setRendered] = useState(false);

	const [companyName, setCompanyName] = useState("");
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


	function addNewItem(){
		setItems([...items, { description: "", rate: 0.00, qty: 1, amount: 0.00, }]);
	}


	function deleteItem(index){
		let temp = [...items];
		temp.splice(index, 1);
		setItems(temp);
	}


	function setItemProperty(property, value, index){
		let temp = [...items];
		temp[index][property] = value;
		setItems(temp);
	}


	return(
		<Container>
			<Modal open={rendered} onClose={() => setRendered(false)}>
				<Box sx={{ position: 'absolute',
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "80%",
					height: "80%",
					color: "white",
					padding: "16px" }}>
					<PDFViewer style={{ width: "100%", height: "100%" }}>
						<GeneratedDocument
							companyName={companyName}
							billTo={billTo}
							date={date}
							invoiceNumber={invoiceNumber}
							projectAddress={projectAddress}
							poNumber={poNumber}/>
					</PDFViewer>
				</Box>
			</Modal>

			<Stack gap="64px" sx={{ paddingTop: "64px", paddingBottom: "64px" }}>
				<Typography variant="h4" gutterBottom>
					Invoice Generator
				</Typography>
				
				<Header
					companyName={companyName} setCompanyName={setCompanyName}
					projectAddress={projectAddress} setProjectAddress={setProjectAddress}
					poNumber={poNumber} setPoNumber={setPoNumber}
					billTo={billTo} setBillTo={setBillTo}
					date={date} setDate={setDate}
					invoiceNumber={invoiceNumber} setInvoiceNumber={setInvoiceNumber}
					/>

				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Item</TableCell>
							<TableCell sx={{ width: "12.5%" }}>Rate</TableCell>
							<TableCell sx={{ width: "7.5%" }}>Qty</TableCell>
							<TableCell sx={{ width: "20%" }} align="right">Amount</TableCell>
							<TableCell sx={{ width: "15%" }} align="right">
								<Button
									size="small"
									variant="contained"
									startIcon={<AddIcon/>}
									onClick={addNewItem}>New Item</Button>
							</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{
							items.map((item, index) => (
								<InvoiceItem
									key={index}
									id={index}
									data={item}
									setItemProperty={(property, value) => setItemProperty(property, value, index)}
									handleDelete={deleteItem}/>
							))
						}

						<Summary data={summary}/>
					</TableBody>
				</Table>

				<Button variant="contained" size="large" onClick={() => setRendered(true)}>Generate</Button>
			</Stack>
		</Container>
	)
}
