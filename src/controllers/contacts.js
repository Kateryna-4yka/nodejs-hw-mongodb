import { getAllContacts, getContactsById } from '../services/contacts.js';

// ===================================Запити на сервер за всіма контактами
export const getAllContactsController = async (req, res) => {
  try {
    const contacts = await getAllContacts();
// якщо контакти не знайдено
	if (!contacts) {
	  res.status(404).json({
		  message: 'Contacts not found'
	  });
	  return;
	}
// якщо контакти знайдено
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (error) {
// якщо сервер лежить відпочиває
    res.status(500).json({
      status: 500,
      message: "Server error",
      data: error,
    });
  }
};

// ===================================Запити на сервер за 1 контактом по його айді
export const getContactById = async (req, res) => {
  const contactsID = req.params.id;
  const contact = await getContactsById (contactsID);

	if (!contact) {
	  res.status(404).json({
		  message: 'Contact not found'
	  });
	  return;
	}

	// Відповідь, якщо контакт знайдено
    res.status(200).json({
      status: 200,
	    message: "Successfully found contact with id {contactId}!",
      data: contact,
    });
  };
