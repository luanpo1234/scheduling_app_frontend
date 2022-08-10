const useTimeConversion = () => {

    const convertToDateObj = (timeslot) => {
        const [ year, month, day, startTime, endTime ] = timeslot.split("-");
        const thisDate = new Date(year, month, day, startTime)
        return thisDate;
    }

    //rola de renomear ou mudar essa função
    // toLocaleString retorna uma string e não um objeto Date, então não é bem o que você quer!
    const getBrazilTime = (timeslot) => {
        const [ year, month, day, startTime, endTime ] = timeslot.split("-");
        const thisDate = new Date(year, month, day, startTime).toLocaleString("pt-BR", {timeZone: 'America/Sao_Paulo'});
        return thisDate;
        }

    const incrementDays = (dateInput, increment)  => {
        const dateFormatTotime = new Date(dateInput);
        const increasedDate = new Date(dateFormatTotime.getTime() + (increment * 86400000));
        return increasedDate;
    }
    return {convertToDateObj, incrementDays};
}

export default useTimeConversion;