import styled from "@emotion/styled";

export default function BulletLayout({ description }) {
  return (
    <BulletWrapper>
      <DescriptionWrapper>
        <li>{description}</li>
      </DescriptionWrapper>
    </BulletWrapper>
  );
}

const BulletWrapper = styled.div`
  display: flex;
  color: var(--red-background);
  font-size: 12px;
  line-height: 18px;
  word-break: keep-all;
`;

const DescriptionWrapper = styled.ul`
  padding-top: 0px;
  padding-left: 2em;

  li {
    list-style-type: disc;

    ::marker {
      font-size: 0.8em;
    }
  }
`;
