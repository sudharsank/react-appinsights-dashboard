import * as React from 'react';
import styles from '../CommonControl.module.scss';
import { Label, ILabelStyles } from 'office-ui-fabric-react/lib/Label';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { IStyleSet } from 'office-ui-fabric-react/lib/Styling';

export interface IPivotProps {
    ShowLabel: boolean;
    LabelText: string;
    Items: any[];
}

const CustomPivot: React.FunctionComponent<IPivotProps> = (props) => {

    return (
        <div style={{ display: 'flex' }}>
            {props.ShowLabel &&
                <label className={styles.dataLabel}>{props.LabelText}</label>
            }
            <Pivot aria-label="Basic Pivot Example" className={styles.pivotControl}>
                {props.Items &&
                    props.Items.map(item => {
                        return (
                            <PivotItem headerText={item.text} itemKey={item.key} />
                        );
                    })
                }
            </Pivot>
        </div>
    );
};

export default CustomPivot;