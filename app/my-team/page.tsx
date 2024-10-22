import AppMyTeam from "@/components/main/AppMyTeam";

const MyTeam = (props: any) => {
  const { params, searchParams } = props;
  return (
    <main className="flex min-h-screen flex-col items-center pt-24">
      <AppMyTeam />
    </main>
  );
};

export default MyTeam;
