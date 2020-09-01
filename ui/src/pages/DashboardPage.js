import React from "react";
import { Page, Grid, StatsCard, Header, Table } from "tabler-react";
import { useFetch } from "../common/hooks/useFetch";
import moment from "moment";

import "./DashboardPage.css";

export default () => {
  const [data, loading] = useFetch("api/statistiques");
  console.log(data);

  return (
    <Page>
      <Page.Main>
        <Page.Content title="Tableau de bord">
          {loading && "Chargement des données..."}
          {data && (
            <>
              <Header.H5>Accueil admin</Header.H5>
              <Grid.Row cards={true}>
                <Grid.Col sm={4} lg={2}>
                  <StatsCard layout={1} movement={0} total={data.stats.nbTotal} label="Items" />
                </Grid.Col>
                <Grid.Col sm={4} lg={2}>
                  <StatsCard layout={1} movement={0} total={data.import.nbCfasTotaux} label="Cfas" />
                </Grid.Col>
                <Grid.Col sm={4} lg={2}>
                  <StatsCard layout={1} movement={0} total={data.import.nbJeunesTotaux} label="Jeunes" />
                </Grid.Col>
                <Grid.Col sm={4} lg={2}>
                  <StatsCard
                    layout={1}
                    movement={0}
                    total={data.import.nbJeunesMultiAcademie.length}
                    label="Jeunes ayant voeux dans multiples académies"
                  />
                </Grid.Col>
              </Grid.Row>
            </>
          )}
        </Page.Content>
      </Page.Main>
    </Page>
  );
};
