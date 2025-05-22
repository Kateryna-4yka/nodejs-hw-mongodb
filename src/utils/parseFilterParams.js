function parseInfoIsFavourite (filterBy) {
    if (filterBy === 'undefined') {
        return undefined;
    }

    return filterBy;
}

function parseInfoContactType (filterBy) {
    if (filterBy === 'undefined') {
        return undefined;
    }

    if(filterBy !== 'work' && filterBy !== 'home' && filterBy !== 'personal') {
        return undefined;
    }

    return filterBy;
}

export function parseFilterParams (query) {
    const { isFavourite, contactType } = query;

    const parseIsFavourite = parseInfoIsFavourite(isFavourite);
    const parseContactType = parseInfoContactType(contactType);

    return{
        isFavourite: parseIsFavourite,
        contactType: parseContactType,
    };
}
