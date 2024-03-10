import axios from 'axios';
import { ContactMutation } from './types/ContactMutation';

export type ContactRecord = ContactMutation & {
  id: string;
  createdAt: string;
};
const url = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
/* eslint-disable @typescript-eslint/no-explicit-any */
export function flattenAttributes(data: any): any {
  // Base case for recursion
  if (!data) return null;

  // Handling array data
  if (Array.isArray(data)) {
    return data.map(flattenAttributes);
  }

  let flattened: { [key: string]: any } = {};

  // Handling attributes
  if (data.attributes) {
    for (const key in data.attributes) {
      if (
        typeof data.attributes[key] === 'object' &&
        data.attributes[key] !== null &&
        'data' in data.attributes[key]
      ) {
        flattened[key] = flattenAttributes(data.attributes[key].data);
      } else {
        flattened[key] = data.attributes[key];
      }
    }
  }

  // Copying non-attributes and non-data properties
  for (const key in data) {
    if (key !== 'attributes' && key !== 'data') {
      flattened[key] = data[key];
    }
  }

  // Handling nested data
  if (data.data) {
    flattened = { ...flattened, ...flattenAttributes(data.data) };
  }

  return flattened;
}
export async function getContacts() {
  try {
    const response = await axios.get(url + '/api/contacts');
    const data = await response.data;
    const flattenAttributesData = flattenAttributes(data.data);
    return flattenAttributesData;
  } catch (error) {
    console.log(error);
  }
}

export async function createContact(data: ContactMutation) {
  try {
    const response = await axios.post(
      url + '/api/contacts',
      { data: { ...data } },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const responseData = response.data;
    const flattenAttributesData = flattenAttributes(responseData.data);
    return flattenAttributesData;
  } catch (error) {
    console.error(error);
    throw new Error('Oh no! Something went wrong!');
  }
}

export async function getContact(id: string) {
  try {
    const response = await axios.get(url + `/api/contacts/${id}`);
    const data = await response.data;
    const flattenAttributesData = flattenAttributes(data.data);
    return flattenAttributesData;
  } catch (error) {
    console.log(error);
  }
}

export async function updateContact(id: string, updates: ContactMutation) {
  try {
    const response = await axios.put(
      url + `/api/contacts/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { ...updates },
      }
    );
    const responseData = response.data;
    const flattenAttributesData = flattenAttributes(responseData.data);
    return flattenAttributesData;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteContact(id: string) {
  try {
    const response = await axios.delete(url + `/api/contacts/${id}`);
    const data = await response.data;
    const flattenAttributesData = flattenAttributes(data.data);
    return flattenAttributesData;
  } catch (error) {
    console.log(error); 
  }
}
