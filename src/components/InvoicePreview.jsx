import { Stack } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Typography from '@mui/material/Typography';

import Summary from "./Summary";

export default function InvoicePreview(props){
	return(
		<Stack sx={{ ...props.sx, margin: "64px", padding: "64px", background: "white" }}>
			<Typography variant="h5">Invoice</Typography>
			
			{
				props.companyName
					? <Typography>{props.companyName}</Typography>
					: <></>
			}

			{
				props.billTo
					? <Typography>{props.billTo}</Typography>
					: <></>
			}
			
			{
				props.date
					? <Typography>{props.date.format("LL")}</Typography>
					: <></>
			}
			
			{
				props.invoiceNumber
					? <Typography>{props.invoiceNumber}</Typography>
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

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Item</TableCell>
						<TableCell>Rate</TableCell>
						<TableCell>Qty</TableCell>
						<TableCell align="right">Amount</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{
						props.items.map((item, index) => (
							<TableRow>
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