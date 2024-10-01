import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export default function GeneratedDocument(props){
	const styles = StyleSheet.create({
		page: { backgroundColor: 'white' },
		section: { margin: "1in", fontSize: "12pt" },
		title: { fontSize: "16pt" },
	});
	
	
	const parsedDate = props.date.format("LL");


	return(
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.section}>
					<Text style={styles.title}>{props.companyName}</Text>
					
					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Text>{props.projectAddress}</Text>
						<View style={{ flexDirection: "row", gap: "0.5in" }}>
							<Text>{parsedDate}</Text>
							<Text>{props.invoiceNumber}</Text>
						</View>
					</View>
					
					<Text>{props.billTo}</Text>
					
					<Text>{props.poNumber}</Text>
				</View>
			</Page>
		</Document>
	)
}