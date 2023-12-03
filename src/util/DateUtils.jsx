const formatTimestamp = (timestamp) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
        timeZone: 'Europe/Istanbul',
    };
    const formattedDate = new Intl.DateTimeFormat('tr-TR', options).format(new Date(timestamp));
    return formattedDate.replace(/,/g, '');
}

export default formatTimestamp
