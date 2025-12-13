"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import {
  setGeneratedVariations,
  setVariationAttributes,
} from "@/redux/features/addProduct/variation/variationSlice";
import { Button } from "@/components/ui/button";
import SingleVariation from "./SingleVariation";
import generateVariations from "../../lib/generateVariation";

const Variations = () => {
  const dispatch = useAppDispatch();
  const { generatedVariations, selectedAttributeValue, variations } =
    useAppSelector(({ productVariation }) => productVariation);

  const variation = () => {
    const generatedData = generateVariations(
      [...selectedAttributeValue],
      [...variations]
    );

    if (generatedData.length < 2) {
      alert(
        "Selected attribute value have to be more than one to generate variations!"
      );
    } else {
      dispatch(setGeneratedVariations(generatedData));
    }
  };

  useEffect(() => {
    generatedVariations.map(({ attributes }, index) =>
      dispatch(setVariationAttributes({ index, item: attributes }))
    );
  }, [dispatch, generatedVariations]);

  const showText =
    Object.keys(selectedAttributeValue).length < 1 &&
    generatedVariations.length < 1;
  const showBtn =
    Object.keys(selectedAttributeValue).length > 0 &&
    generatedVariations.length < 1;

  const removeVariation = () => {
    dispatch(setGeneratedVariations([]));
  };

  return (
    <div className="space-y-2 min-h-20 flex flex-col items-center justify-center">
      {showText ? (
        <p>Select attributes to generate product variations.</p>
      ) : showBtn ? (
        <Button onClick={variation}>Generate variations</Button>
      ) : (
        <>
          <Button onClick={removeVariation} className="mb-2">
            Remove variation
          </Button>
          {generatedVariations.map(({ _id, attributes, isDeleted }, index) => (
            <SingleVariation
              _id={_id}
              item={attributes}
              index={index}
              key={index}
              isDelete={isDeleted}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Variations;
