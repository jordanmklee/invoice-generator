import { Stack } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Typography from '@mui/material/Typography';

import Summary from "./Summary";

export default function InvoicePreview(props){
	return(
		<Stack ref={props.pdfRef} sx={{ ...props.sx, margin: "64px", padding: "64px", background: "white" }}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h5">
					Invoice <span style={{ color: "blue"}}>{props.invoiceNumber ? "#" + props.invoiceNumber : <></> }</span>
				</Typography>
				<div>
					{
						props.date
							? <Typography>{props.date.format("LL")}</Typography>
							: <></>
					}
				</div>
			</Stack>

			<Stack direction="row" gap="64px">
				<div>
					<Typography>Bill From</Typography>
					{
						props.companyName
							? <Typography>{props.companyName}</Typography>
							: <></>
					}
				</div>

				<div>
					<Typography>Bill To</Typography>
					{
						props.billTo
							? <Typography>{props.billTo}</Typography>
							: <></>
					}
					{
						props.projectAddress
							? <Typography>{props.projectAddress}</Typography>
							: <></>
					}
					{
						props.poNumber
							? <Typography>{props.poNumber}</Typography>
							: <></>
					}
				</div>
			</Stack>

			<Table size="small" sx={{ marginTop: "24px" }}>
				<TableHead>
					<TableRow>
						<TableCell sx={{ color: "grey" }}>Item</TableCell>
						<TableCell sx={{ color: "grey" }}>Rate</TableCell>
						<TableCell sx={{ color: "grey" }}>Qty</TableCell>
						<TableCell sx={{ color: "grey" }} align="right">Amount</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{
						props.items.map((item, index) => (
							<TableRow key={index}>
								<TableCell>
									<Typography>{item.description}</Typography>
								</TableCell>
								<TableCell>
									<Typography>$ {parseFloat(item.rate).toFixed(2)}</Typography>
								</TableCell>
								<TableCell>
									<Typography>{item.qty}</Typography>
								</TableCell>
								<TableCell align="right">
									<Typography>$ {parseFloat(item.amount).toFixed(2)}</Typography>
								</TableCell>
							</TableRow>
						))
					}
				
					<Summary data={props.summary}/>
				</TableBody>
			</Table>
		</Stack>
	)
}