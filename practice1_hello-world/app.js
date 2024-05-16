async function fetchGreeting() {
  const res = await fetch("http://localhost:3000/", {
    method: 'POST',
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({ query: "{ greeting }" }),
  });

  const {data} = await res.json();

  console.log(data.greeting);

  return data.greeting;
}

fetchGreeting().then(data => {
    document.querySelector('strong').innerHTML = data;
})