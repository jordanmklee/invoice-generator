import { Box, Button, Stack, Divider } from '@mui/material';
import { TextField, IconButton, InputAdornment } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Typography from '@mui/material/Typography';

import { Add as AddIcon } from '@mui/icons-material';
import { Close as CloseIcon } from '@mui/icons-material';


function Header(props){
	return(
		<Stack gap="16px">
			<Typography variant="h6">Info</Typography>

			<TextField
				size="small"
				label="Company Name"
				value={props.companyName}
				onChange={e => props.setCompanyName(e.target.value)}/>
			
			<TextField
				size="small"
				label="Project Address"
				value={props.projectAddress}
				onChange={e => props.setProjectAddress(e.target.value)}/>

			<TextField
				size="small"
				label="P.O. Number"
				value={props.poNumber}
				onChange={e => props.setPoNumber(e.target.value)}/>
			
			<TextField
				size="small"
				label="Bill To"
				value={props.billTo}
				onChange={e => props.setBillTo(e.target.value)}/>
			
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker
					slotProps={{ textField: { size: "small" } }}
					format="LL"
					label="Date"
					value={props.date}
					onChange={e => props.setDate(e)}/>
			</LocalizationProvider>
			
			<TextField
				size="small"
				label="Invoice Number"
				value={props.invoiceNumber}
				onChange={e => props.setInvoiceNumber(e.target.value)}/>
		</Stack>
	)
}

function InvoiceItem(props){
	return(
		<Stack direction="row" gap="8px" padding="16px 0px">
			<Stack flex="1" gap="8px">
				<TextField
					placeholder="Description"
					fullWidth
					size="small"
					value={props.data.description}
					onChange={e => props.setItemProperty("description", e.target.value)}/>
				
				<Stack direction="row" gap="16px">
					<TextField
						placeholder="0.00"
						fullWidth
						size="small"
						value={props.data.rate || ""}
						onChange={e => {
							// Only allow number entry up to two decimal places
							if(e.target.value.match(/^[0-9]*(\.[0-9]{0,2})?$/)){
								props.setItemProperty("rate", e.target.value);
								props.setItemProperty("amount", (e.target.value * props.data.qty));
							}
						}}
						slotProps={{
							input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
							htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
						}}/>
				
					<TextField
						placeholder="0"
						fullWidth
						size="small"
						value={props.data.qty}
						onChange={e => {
							// Only allow number entry
							if(e.target.value.match(/^(|\d)+$/)){
								props.setItemProperty("qty", e.target.value);
								props.setItemProperty("amount", (props.data.rate * e.target.value));
							}
						}}
						slotProps={{
							htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
						}}/>
				</Stack>
			
				{/* <Typography variant="body1">$ {parseFloat(props.data.amount).toFixed(2)}</Typography> */}
				</Stack>
				<Box>
					<IconButton onClick={() => props.handleDelete(props.id)}>
						<CloseIcon/>
					</IconButton>
				</Box>
		</Stack>
	)
}

export default function Form(props){
	function addNewItem(){
		props.setItems([...props.items, { description: "", rate: 0.00, qty: 1, amount: 0.00, }]);
	}


	function deleteItem(index){
		let temp = [...props.items];
		temp.splice(index, 1);
		props.setItems(temp);
	}


	function setItemProperty(property, value, index){
		let temp = [...props.items];
		temp[index][property] = value;
		props.setItems(temp);
	}

	return(
		<Stack gap="32px" sx={{ ...props.sx, padding: "32px", background: "white" }}>
			<Header
				companyName={props.companyName} setCompanyName={name => {
					localStorage.setItem("companyName", name);
					props.setCompanyName(name);
				}}
				projectAddress={props.projectAddress} setProjectAddress={props.setProjectAddress}
				poNumber={props.poNumber} setPoNumber={props.setPoNumber}
				billTo={props.billTo} setBillTo={props.setBillTo}
				date={props.date} setDate={props.setDate}
				invoiceNumber={props.invoiceNumber} setInvoiceNumber={props.setInvoiceNumber}/>

			<Divider/>

			<Stack>
				<Typography variant="h6">Items</Typography>
				
				{
					props.items.map((item, index) => (
						<InvoiceItem
						key={index}
						id={index}
						data={item}
						setItemProperty={(property, value) => setItemProperty(property, value, index)}
						handleDelete={deleteItem}/>
					))
				}
			
				<Button
					size="small"
					variant="contained"
					startIcon={<AddIcon/>}
					onClick={addNewItem}>New Item</Button>
			</Stack>
		</Stack>
	)
}

