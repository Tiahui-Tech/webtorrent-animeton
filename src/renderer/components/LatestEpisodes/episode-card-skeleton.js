const React = require('react');
const {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Skeleton
} = require('@nextui-org/react');

const EpisodeCardSkeleton = () => {
  return (
    <div className="w-[400px] h-[345px] z-10">
      <Card className="flex flex-col z-10 relative overflow-visible">
        <CardHeader className="flex flex-col truncate items-start justify-start z-10">
          <Skeleton className="w-3/4 rounded-lg">
            <div className="h-6 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-1/2 rounded-lg mt-2">
            <div className="h-4 rounded-lg bg-default-100"></div>
          </Skeleton>
        </CardHeader>
        <CardBody className="p-0 relative z-50">
          <Skeleton className="w-full rounded-t-lg">
            <div className="aspect-[16/9] rounded-t-lg bg-default-300"></div>
          </Skeleton>
          <Skeleton className="absolute top-2 right-2 rounded-md">
            <div className="h-6 w-16 rounded-md bg-default-200"></div>
          </Skeleton>
        </CardBody>
        <CardFooter>
          <div className="flex justify-between items-center w-full mt-2">
            <Skeleton className="rounded-lg">
              <div className="h-4 w-24 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-4 w-24 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

module.exports = EpisodeCardSkeleton;
