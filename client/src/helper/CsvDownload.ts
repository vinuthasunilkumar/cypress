const CsvDownload = (csvString: any, fileName: any) => {
    let link = window.document.createElement('a');
    link.setAttribute('href', 'data:text/csv; charset=utf-8,' + encodeURIComponent("\uFEFF" + csvString));
    link.setAttribute('download', fileName);
    window.document.body.appendChild(link);
    link.click();
    link.remove();
}
export default CsvDownload;