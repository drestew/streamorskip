function Category({ catalog, category }: any) {
  return (
    <>
      <h1>this is {category}</h1>
      {catalog.map((item: any) => {
        return (
          <>
            <p>{item.id}</p>
            <p>{item.title}</p>
          </>
        );
      })}
    </>
  );
}

export default Category;

export async function getStaticPaths() {
  const res = await fetch('http://localhost:4000/catalog');
  const data = await res.json();

  const paths = data.map((item: any) => {
    return {
      params: {
        id: `${item.id}`,
        category: `${item.category}`,
      },
    };
  });
  return {
    paths: paths,
    fallback: false,
  };
}
export async function getStaticProps({ params }: any) {
  const { category } = params;
  const res = await fetch(`http://localhost:4000/catalog?category=${category}`);
  const data = await res.json();

  return {
    props: {
      catalog: data,
      category,
    },
  };
}
