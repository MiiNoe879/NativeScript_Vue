<template>
    <Page>
        <ActionBar>
            <GridLayout width="100%" columns="auto, *">
                <Label @tap="$refs.drawer.nativeView.showDrawer()" col="0" class="fa burger" text.decode="&#xf0c9; "/>
                <Label class="title" text="Deep English"  col="1"/>
            </GridLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer">
            <StackLayout ~drawerContent>
                <Label class="drawer-header" text="Drawer"/>

                <Label class="drawer-item" text="Item 1"/>
                <Label class="drawer-item" text="Item 2"/>
                <Label class="drawer-item" text="Item 3"/>
            </StackLayout>

            <GridLayout ~mainContent columns="*" rows="*">
                <Label class="message" :text="msg" col="0" row="0"/>
            </GridLayout>
        </RadSideDrawer>
        <!--<GridLayout>
            <Label class="info" horizontalAlignment="center" verticalAlignment="center">
                <FormattedString>
                    <Span class="fa" text.decode="&#xf135; "/>
                    <Span :text="message"/>
                </FormattedString>
            </Label>
        </GridLayout>-->
    </Page>
</template>

<script >
  export default {
    data() {
      return {
        msg: 'Welcome to Deep English.'
      }
    }
  }
</script>

<style scoped>
ActionBar {
    background-color: #4f8ab6;
    color: #ffffff;
}

.title {
    text-align: left;
    padding-left:16;
    font-size:18;
}

.message {
    vertical-align: center;
    text-align: center;
    font-size: 20;
}
.burger {
  font-size:20;
}
</style>
