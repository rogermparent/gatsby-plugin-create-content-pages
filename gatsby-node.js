const path = require("path");

exports.createPages = async ({ graphql, actions, reporter, store }) => {
  const { createPage } = actions;

  const programDirectory = store.getState().program.directory;

  const result = await graphql(`
    {
      allContentPage {
        nodes {
          id
          pagePath
          template
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic(result.errors);
  }

  const { allContentPage } = result.data;
  const pages = allContentPage.nodes;

  // Create a page for each ContentPage
  for (const page of pages) {
    const { pagePath, template } = page;

    if (pagePath) {
      // Get the absolute path of this page's template
      const pageComponent = require.resolve(
        path.isAbsolute(template)
          ? template
          : path.join(programDirectory, template)
      );

      createPage({
        path: pagePath,
        component: pageComponent,
        context: {
          id: page.id
        }
      });
    }
  }
};
