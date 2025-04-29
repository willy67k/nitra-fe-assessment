import { locations, organization, paymentReaders } from "./data";

function axiosMock(data) {
  const axiosMockData = {
    data: structuredClone(data),
    status: 200,
    statusText: "OK",
    headers: {},
    config: {},
    request: {},
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(axiosMockData);
    }, 500);
  });
}

export function getOrganization() {
  return axiosMock(organization);
}

export function getLocations() {
  return axiosMock(locations);
}

export function getPaymentReaders() {
  return axiosMock(paymentReaders);
}
