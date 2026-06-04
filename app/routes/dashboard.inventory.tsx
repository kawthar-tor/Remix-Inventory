import {List, Text, BlockStack, Spinner, Button, Banner} from '@shopify/polaris';
import { useLoaderData, Await, useFetcher, type ActionFunctionArgs, useRevalidator, useRouteError, useAsyncError } from 'react-router';
import { Fragment, Suspense, useEffect, useRef, useState } from 'react';
import {PlusIcon} from '@shopify/polaris-icons';
import { getInventory, claimStock } from '../models/inventory.server';

// loader
export async function loader() {
    return {
        inventory : getInventory().catch((e) => {
            throw new Error(
                e instanceof Error ? e.message : "Failed to load inventory"
            );
        })
    }
}

// Mutate stocks
export async function action({request} : ActionFunctionArgs) {
    const formData = await request.formData();
    const id = formData.get("id");
    if (typeof id !== "string"){
        throw new Error("invalid product's id type");
    }
    try{
        const item = await claimStock(id);
        return {data : item.id, status :200};
    }catch(e){
        return {failedId : id, status : 500};
    }
}
// Errors function
export function ErrorBanner({error} : { error?: unknown }) {
    const revalidator = useRevalidator();
    const isRevalidating = revalidator.state !== "idle";
    return (
    <Banner
      title="Server temporary unavailable"
      action={{content: 'Retry', onAction: () => revalidator.revalidate(), loading: isRevalidating}}
      tone="critical"
    >
      <Text as ="p">
        The server throw an {''}
        {error instanceof Error ? error.message : "Unknown error"}.
      </Text>
    </Banner>);
}

// Async errors for Await
export function AsyncError() {
    const error = useAsyncError();
    return (
    <ErrorBanner error={error}/>);
}

// Route level errors
export function ErrorBoundary(){
    const error = useRouteError();
    return (
    <ErrorBanner error={error}/>);
}

export default function Inventory(){
    const {inventory} = useLoaderData<typeof loader>();
    const [stock, setStock] = useState<Record<string, number>>({});
    const stockLastRef= useRef<{id : string, prevStock : number} | null>(null);
    const [submittedId, setSubmittedId] = useState("");
    const fetcher = useFetcher();
    const isSubmitting = (fetcher.state !== "idle");

    // claim stock callback
    const handleClaim = (id : string) => {
        if (stock[id] === undefined) return;
        stockLastRef.current = {
            id,
            prevStock : stock[id]
        }
        setStock(prev => ({
            ...prev,
            [id] : prev[id] - 1
        }));
        setSubmittedId(id);
        fetcher.submit({id : id}, {method : "post"});
    };

    // Initiate stock state
    useEffect(() => {
        inventory.then(data => {
            setStock(
            Object.fromEntries(
                data.map(item => [item.id, item.stock])
            ));
        });
        }, [inventory]);

    // Handle Stock RollBack
    useEffect(() => {
        if(!fetcher.data) return;
        const actionData = fetcher.data;
        if(actionData?.status === 500) {
            const prevValue = stockLastRef.current;
            if(prevValue){
                setStock(prev => ({
                    ...prev,
                    [prevValue.id] : prevValue.prevStock
                }))
            }
        }
    }, [fetcher.data]);

    return (
    <BlockStack gap="400">
        <Text as="h1" variant="headingXl">
        Inventory
        </Text>
        {/* Immediate rendering effect */}
        <Suspense fallback={<Spinner accessibilityLabel="Loading inventory" size="small" />} >
            <Await resolve={inventory} errorElement={<AsyncError/>}>
                {(data) => (
                    <List type="bullet">
                    {stock && data.map((item)=>(
                        <Fragment key={item.id}>
                        <List.Item>Product Name : {item.name} | Stock : {stock[item.id] ?? item.stock}</List.Item>
                        <Button disabled={isSubmitting && submittedId === item.id} id={item.id} size='micro' icon={PlusIcon} onClick={()=> {handleClaim(item.id)}}>Claim One</Button>
                        </Fragment>))
                    }
                    </List>
                )}
            </Await>
        </Suspense>
    </BlockStack>
    );
};