export default function CatalogList({ catalog }: any) {
  return (
    <>
      <h1>List items in catalog</h1>
      {catalog.map((item: any) => {
        return (
          <div key={item.id}>
            <p>{item.title}</p>
            <p>{item.type}</p>
          </div>
        );
      })}
    </>
  );
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:4000/catalog');
  const data = await res.json();

  return {
    props: {
      catalog: data,
    },
  };
}
