function App() {
    const [nb, setnb] = useState(0);
    const [nbb, setnbb] = useState(0);


    return jsx("div", {},
        jsx("h1", {}, "simple"),
        jsx("button", { onClick: () => setnb(nb + 1) }, "Add"),
        jsx("span", {}, `salaaaam1=> ${nb}`),
        jsx("button", { onClick: () => setnbb(nbb + 1) }, "Add"),
        jsx("span", {}, `salaaaam2=> ${nbb}`)
    );
}

render();
