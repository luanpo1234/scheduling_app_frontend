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
    
    const convertFromBrazilTime = (dateInput) => {
        const newDate = new Date(dateInput);
        const brazilTimeOffset = -420;
        const localTimeOffset = dateInput.getTimezoneOffset();
        const timeDiffFromBrazil = (Math.abs(localTimeOffset)-Math.abs(brazilTimeOffset));
        newDate.setMinutes(newDate.getMinutes() - timeDiffFromBrazil)
        return newDate;
    }

    const incrementDays = (dateInput, increment)  => {
        const dateFormatTotime = new Date(dateInput);
        const increasedDate = new Date(dateFormatTotime.getTime() + (increment * 86400000));
        return increasedDate;
    }
    return {convertToDateObj, convertFromBrazilTime, incrementDays};
}

export default useTimeConversion;