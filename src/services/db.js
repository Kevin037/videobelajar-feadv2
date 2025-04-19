import api from "./api";

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID; // ganti sesuai project kamu

export const parseFirestoreFields = (data) => {
  const parsed = {};

  Object.keys(data).forEach((key) => {
    const valueObj = data[key];
    const value = Object.values(valueObj)[0]; // Ambil isi dari stringValue, integerValue, dll.
    parsed[key] = value;
  });

  return parsed;
};

export async function retrieveData(collectionName, filterGroup = null, columnName = null, user = null) {
  const endpoint = `/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}`;

  const response = await api.get(endpoint);

  const documents = response.data.documents || [];

  const formatted = documents.map((doc) => {
    const id = doc.name.split('/').pop();
    const fields = Object.entries(doc.fields || {}).reduce((acc, [key, val]) => {
      const value = Object.values(val)[0]; // ambil isi stringValue/numberValue/dll
      acc[key] = value;
      return acc;
    }, {});
    return {
      id,
      ...fields
    };
  });

  // filter jika dibutuhkan
  if (filterGroup) {
    if (user) {
      return formatted.filter(
        item => item[columnName] === filterGroup && item.user_id === user
      ); 
    } else {
      return formatted.filter(
        item => item[columnName] === filterGroup
      ); 
    }
  } else {
    if (user) {
      return formatted.filter(
        item => item.user_id === user
      ); 
    }
  }

  return formatted;
}

export async function classFilterData(ClassType = null, price = null, duration = null, keyword = null, ordering = null) {
  const endpoint = `/projects/${PROJECT_ID}/databases/(default)/documents/classes`;

  const response = await api.get(endpoint);

  const documents = response.data.documents || [];

  const formatted = documents.map((doc) => {
    const id = doc.name.split('/').pop();
    const fields = Object.entries(doc.fields || {}).reduce((acc, [key, val]) => {
      const value = Object.values(val)[0]; // ambil isi stringValue/numberValue/dll
      acc[key] = value;
      return acc;
    }, {});
    return {
      id,
      ...fields
    };
  });

  const filtered = formatted.filter((item) => {
    const matchClassType = ClassType ? item.group === ClassType : true;
    let matchPrice = true;
    let matchDuration = true;
    if (price) {
      if (price === "0") {
        matchPrice = item.new_price < 100000;
      }
      if (price === "1") {
         matchPrice = item.new_price >= 100000 && item.new_price <= 300000;
      }
      if (price === "2") {
         matchPrice = item.new_price > 300000;
      }
    }
    if (duration) {
      if (duration === "0") {
        matchDuration = item.total_time < 240;
      }
      if (duration === "1") {
        matchDuration = item.total_time >= 240 && item.total_time <= 480;
      }
      if (duration === "2") {
        matchDuration = item.total_time > 480;
      }
    }
    const matchKeyword = keyword ? item.title.toLowerCase().includes(keyword.toLowerCase()) : true;
    return matchClassType && matchPrice && matchDuration && matchKeyword;
  });

  if (ordering) {
    if (ordering === "0") {
      filtered.sort((a, b) => a.new_price - b.new_price);
    }
    if (ordering === "1") {
      filtered.sort((a, b) => b.new_price - a.new_price);
    }
    if (ordering === "2") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (ordering === "3") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }
    if (ordering === "4") {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    if (ordering === "5") {
      filtered.sort((a, b) => a.rating - b.rating);
    }
  }
  
  return filtered;
}

export async function getDataById(id,collectionName) {
  const endpoint = `/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}/${id}`;
  const response = await api.get(endpoint);
  return response.data;
}

function buildFirestoreFields(data) {
    const fields = {};
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "number") {
        if (Number.isInteger(value)) {
          fields[key] = { integerValue: value };
        } else {
          fields[key] = { doubleValue: value };
        }
      } else if (typeof value === "string") {
        const isISODate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/.test(value);
        fields[key] = isISODate
          ? { timestampValue: value }
          : { stringValue: value };
      } else if (typeof value === "boolean") {
        fields[key] = { booleanValue: value };
      }
    });
    return fields;
  }
  
  export async function store(data,collectionName) {
    const endpoint = `/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}`;
    
    const body = {
      fields: buildFirestoreFields(data),
    };
  
    const response = await api.post(endpoint, body);
    return response.data;
  }

  export async function update(data, collectionName, documentId) {
    const endpoint = `/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}/${documentId}`;
  
    const fieldPaths = Object.keys(data).map((key) => `updateMask.fieldPaths=${key}`).join("&");

    const body = {
      fields: buildFirestoreFields(data),
    };
  
    await api.patch(`${endpoint}?${fieldPaths}`, body); // PATCH, bukan POST
    return {
      id: documentId,
      ...data,
    };
  }
 
  export async function loginUser({ email, password }) {
    const endpoint = `/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
  
    const body = {
      structuredQuery: {
        from: [{ collectionId: "users" }],
        where: {
          compositeFilter: {
            op: "AND",
            filters: [
              {
                fieldFilter: {
                  field: { fieldPath: "email" },
                  op: "EQUAL",
                  value: { stringValue: email }
                }
              },
              {
                fieldFilter: {
                  field: { fieldPath: "password" },
                  op: "EQUAL",
                  value: { stringValue: password }
                }
              }
            ]
          }
        },
        limit: 1
      }
    };
  
    const response = await api.post(endpoint, body);
    const document = response.data.find((item) => item.document);
  
    if (!document) {
      throw new Error("Email atau password salah");
    }
  
    // Ambil data user
    const userData = document.document.fields;
    const id = document.document.name.split('/').pop();
  
    return {
      id,
      ...Object.fromEntries(
        Object.entries(userData).map(([key, val]) => [key, val.stringValue])
      )
    };
  }