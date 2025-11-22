function App() {
    const [count, setCount] = useState(0);




    return jsx(
        "div",
        null,
        jsx("p", { className: count }, `Count: ${count}`),
        jsx("h1", { className: count }, `Count: 2121`),
        jsx("button", { onClick: () => setCount(count + 1) }, "Increment")
    );
}

render(); // initial render
